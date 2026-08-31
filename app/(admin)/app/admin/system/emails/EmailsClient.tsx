"use client"

import { useState, useTransition } from "react"
import { Mail, Edit, Plus, RefreshCw, Send, Check } from "lucide-react"
import { saveEmailTemplate, sendTestEmail } from "./actions"

interface Template {
  id: string
  name: string
  subject: string
  htmlBody: string
}

interface EmailLog {
  id: string
  templateName: string
  recipient: string
  status: string
  sentAt: string
  error: string | null
}

interface EmailsClientProps {
  templates: Template[]
  logs: EmailLog[]
}

export function EmailsClient({ templates, logs }: EmailsClientProps) {
  const [activeTab, setActiveTab] = useState<"templates" | "logs">("templates")
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Test email sender
  const [testEmailRecipient, setTestEmailRecipient] = useState("")
  const [testTemplateId, setTestTemplateId] = useState("")

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await saveEmailTemplate(formData)
        alert("Template saved successfully.")
        setEditingTemplate(null)
        setIsCreating(false)
      } catch (err: any) {
        alert(err.message)
      }
    })
  }

  const handleSendTest = () => {
    if (!testEmailRecipient || !testTemplateId) return alert("Select template and specify recipient email.")
    startTransition(async () => {
      try {
        await sendTestEmail(testTemplateId, testEmailRecipient)
        alert("Test email dispatched and logged successfully.")
        setTestEmailRecipient("")
        setTestTemplateId("")
      } catch (err: any) {
        alert(err.message)
      }
    })
  }

  return (
    <div className="space-y-6">
      
      {/* Tab Switcher */}
      <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab("templates")}
            className={`text-xs font-semibold uppercase tracking-wider pb-2 border-b-2 transition ${
              activeTab === "templates" 
                ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white" 
                : "border-transparent text-zinc-400"
            }`}
          >
            Email Templates
          </button>
          <button 
            onClick={() => setActiveTab("logs")}
            className={`text-xs font-semibold uppercase tracking-wider pb-2 border-b-2 transition ${
              activeTab === "logs" 
                ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white" 
                : "border-transparent text-zinc-400"
            }`}
          >
            Delivery Logs
          </button>
        </div>

        {activeTab === "templates" && !editingTemplate && !isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 shadow-sm"
          >
            <Plus size={14} /> Create Template
          </button>
        )}
      </div>

      {activeTab === "templates" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main List / Form */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Editor mode */}
            {(editingTemplate || isCreating) ? (
              <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 relative">
                {isPending && (
                  <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center z-10">
                    <RefreshCw size={24} className="animate-spin text-zinc-500" />
                  </div>
                )}
                
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                  {isCreating ? "Create Email Template" : `Edit Template: ${editingTemplate?.name}`}
                </h3>

                <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
                  {editingTemplate && <input type="hidden" name="id" value={editingTemplate.id} />}
                  
                  <div>
                    <label className="block text-zinc-500 mb-1">Template Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      defaultValue={editingTemplate?.name || ""}
                      placeholder="e.g. Welcome Email" 
                      required 
                      className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-500 mb-1">Subject Title Line</label>
                    <input 
                      type="text" 
                      name="subject" 
                      defaultValue={editingTemplate?.subject || ""}
                      placeholder="Welcome to InvoiceFlowPro!" 
                      required 
                      className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-500 mb-1">HTML Body Content</label>
                    <textarea 
                      rows={12} 
                      name="htmlBody" 
                      defaultValue={editingTemplate?.htmlBody || ""}
                      placeholder="<h1>Hello {{name}}</h1><p>Welcome to InvoiceFlowPro...</p>" 
                      required 
                      className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 font-mono focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button 
                      type="button"
                      onClick={() => { setEditingTemplate(null); setIsCreating(false); }}
                      className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isPending}
                      className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:opacity-90 transition"
                    >
                      Save Template
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              // List templates
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map(t => (
                  <div key={t.id} className="bg-white dark:bg-zinc-950 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white">{t.name}</h4>
                      <p className="text-[10px] text-zinc-400 mt-1 font-mono">ID: {t.id}</p>
                      <p className="text-xs text-zinc-500 mt-3 font-semibold">Subject: {t.subject}</p>
                    </div>
                    <button 
                      onClick={() => setEditingTemplate(t)}
                      className="mt-6 flex items-center justify-center gap-1.5 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 py-1.5 rounded-lg text-xs font-semibold transition"
                    >
                      <Edit size={12} /> Edit Template
                    </button>
                  </div>
                ))}

                {templates.length === 0 && (
                  <div className="col-span-2 py-12 text-center text-zinc-500 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    No email templates registered. Click "Create Template" to get started.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Test dispatch utility */}
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-fit space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Simulate Dispatch Sender</h3>
            <p className="text-xs text-zinc-500">Dispatch a test email simulation block to log delivery records instantly.</p>
            
            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-zinc-500 mb-1">Target Template</label>
                <select 
                  value={testTemplateId}
                  onChange={(e) => setTestTemplateId(e.target.value)}
                  className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 focus:outline-none"
                >
                  <option value="">Select template...</option>
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-500 mb-1">Recipient Address</label>
                <input 
                  type="email" 
                  placeholder="test@example.com" 
                  value={testEmailRecipient}
                  onChange={(e) => setTestEmailRecipient(e.target.value)}
                  className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>

              <button 
                onClick={handleSendTest}
                disabled={isPending || !testTemplateId || !testEmailRecipient}
                className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Send size={12} /> Send Test Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELIVERY LOGS PANEL */}
      {activeTab === "logs" && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left whitespace-nowrap">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Recipient</th>
                  <th className="px-6 py-4">Template Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Sent Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition">
                    <td className="px-6 py-4 text-zinc-900 dark:text-white font-semibold">{log.recipient}</td>
                    <td className="px-6 py-4 font-mono text-[10px] text-zinc-400">{log.templateName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === "SENT" 
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" 
                          : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{new Date(log.sentAt).toLocaleString()}</td>
                  </tr>
                ))}

                {logs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                      No transactional emails logged in the delivery table yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}
