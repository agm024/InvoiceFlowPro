const fs = require('fs');
let content = fs.readFileSync('app/app/clients/ClientsClient.tsx', 'utf8');

// Render modal
content = content.replace(
  /\{emailModalOpen && selectedClientForEmail && \(/,
  `<UpgradeModal \n        isOpen={showUpgradeModal} \n        onClose={() => setShowUpgradeModal(false)} \n        title="Client Limit Reached" \n        message="You have reached the maximum number of clients allowed on your current plan. Upgrade your plan to add more clients." \n      />\n\n      {emailModalOpen && selectedClientForEmail && (`
);

fs.writeFileSync('app/app/clients/ClientsClient.tsx', content, 'utf8');
