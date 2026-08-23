const fs = require('fs');
let content = fs.readFileSync('app/app/clients/ClientsClient.tsx', 'utf8');

const buttonStart = content.indexOf('<button \r\n                        onClick={async () => {');
if (buttonStart === -1) {
  console.log("Could not find buttonStart. Looking for exact match...");
  const oldButtonStr = `                      <button 
                        onClick={async () => {
                          if (!client.portalToken) return toast.error('Token not generated yet.')
                          if (!client.email) return toast.error('Client has no email address.')
                          
                          if (!window.confirm(\`Are you sure you want to send the portal link to \${client.email}?\`)) return;

                          toast.loading('Sending portal link via email...', { id: 'email' })
                          const { sendPortalLink } = await import('@/app/actions/email')
                          const res = await sendPortalLink(client.email, client.name, client.portalToken)
                          if (res.success) {
                            toast.success('Portal link sent!', { id: 'email' })
                          } else {
                            toast.error('Failed to send link', { id: 'email' })
                          }
                        }}
                        title="Email Portal Link" 
                        className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <Mail size={14} />
                      </button>`;
  if (content.includes(oldButtonStr)) {
     console.log("Found exact button!");
     const newButtonStr = `                      <button 
                        onClick={() => {
                          if (!client.portalToken) return toast.error('Token not generated yet.')
                          if (!client.email) return toast.error('Client has no email address.')
                          
                          setSelectedClientForEmail(client)
                          setEmailSubject("Your Client Portal Access")
                          setEmailMessage("Here is the link to access your dedicated Client Portal. You can view your active projects, estimates, outstanding invoices, and statement of accounts.")
                          setEmailModalOpen(true)
                        }}
                        title="Email Portal Link" 
                        className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <Mail size={14} />
                      </button>`;
     content = content.replace(oldButtonStr, newButtonStr);
  } else {
    // try removing the confirm if it's there
    console.log("Checking if confirm is missing");
  }
}

// Add state
if (!content.includes('setEmailModalOpen')) {
  content = content.replace(
    "  const [searchQuery, setSearchQuery] = useState('')",
    "  const [searchQuery, setSearchQuery] = useState('')\r\n\r\n  const [emailModalOpen, setEmailModalOpen] = useState(false)\r\n  const [emailSubject, setEmailSubject] = useState('')\r\n  const [emailMessage, setEmailMessage] = useState('')\r\n  const [selectedClientForEmail, setSelectedClientForEmail] = useState<Client | null>(null)\r\n  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false)"
  );
}

// Add Modal
const modalCode = `
      {/* Email Modal */}
      {emailModalOpen && selectedClientForEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmittingEmail && setEmailModalOpen(false)}></div>
          <div className="bg-card-bg border border-card-border rounded-2xl shadow-2xl w-full max-w-xl relative z-10 p-6 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-foreground">Email Portal Link</h2>
              <button onClick={() => setEmailModalOpen(false)} disabled={isSubmittingEmail} className="text-zinc-400 hover:text-foreground p-1.5 rounded-md transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault()
              setIsSubmittingEmail(true)
              toast.loading('Sending portal link via email...', { id: 'email' })
              const { sendPortalLink } = await import('@/app/actions/email')
              const res = await sendPortalLink(selectedClientForEmail.email, selectedClientForEmail.name, selectedClientForEmail.portalToken, emailSubject, emailMessage)
              if (res.success) {
                toast.success('Portal link sent!', { id: 'email' })
                setEmailModalOpen(false)
              } else {
                toast.error('Failed to send link', { id: 'email' })
              }
              setIsSubmittingEmail(false)
            }} className="flex flex-col gap-4 overflow-y-auto hide-scrollbar">
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Recipient Email</label>
                <input type="email" readOnly value={selectedClientForEmail.email || ''} className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white opacity-70 cursor-not-allowed" />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Subject</label>
                <input type="text" required value={emailSubject} onChange={e => setEmailSubject(e.target.value)} className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white" />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Message Body</label>
                <textarea required rows={6} value={emailMessage} onChange={e => setEmailMessage(e.target.value)} className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white resize-none"></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-card-border">
                <button type="button" onClick={() => setEmailModalOpen(false)} disabled={isSubmittingEmail} className="px-5 py-2.5 font-medium text-zinc-500 hover:bg-sidebar-bg rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmittingEmail} className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-2.5 rounded-lg font-medium hover:bg-black dark:hover:bg-zinc-200 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2">
                  <Send size={16} />
                  {isSubmittingEmail ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}`;

content = content.replace(/    <\/div>\r?\n  \)\r?\n}/, modalCode);

fs.writeFileSync('app/app/clients/ClientsClient.tsx', content);
