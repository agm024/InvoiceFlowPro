const fs = require('fs');
let content = fs.readFileSync('app/app/clients/ClientsClient.tsx', 'utf8');
const search = "onClick={async () => {";
const buttonStart = content.indexOf(search, content.indexOf("title=\"Share Portal via WhatsApp\""));

const buttonEnd = content.indexOf("title=\"Email Portal Link\"", buttonStart);

if (buttonStart !== -1 && buttonEnd !== -1) {
   const newButton = `onClick={() => {
                          if (!client.portalToken) return toast.error('Token not generated yet.')
                          if (!client.email) return toast.error('Client has no email address.')
                          
                          setSelectedClientForEmail(client)
                          setEmailSubject("Your Client Portal Access")
                          setEmailMessage("Here is the link to access your dedicated Client Portal. You can view your active projects, estimates, outstanding invoices, and statement of accounts.")
                          setEmailModalOpen(true)
                        }}
                        `;
   content = content.substring(0, buttonStart) + newButton + content.substring(buttonEnd);
   fs.writeFileSync('app/app/clients/ClientsClient.tsx', content);
   console.log("Replaced successfully!");
} else {
   console.log("Failed to find button");
}
