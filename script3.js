const fs = require('fs');
const path = 'app/app/settings/MyProfileClient.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacement = `
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteAccount}
        title="Delete Account"
        message="Are you absolutely sure? This action cannot be undone and will permanently delete all your invoices, clients, and company data."
        confirmText="Yes, Delete My Account"
        cancelText="Cancel"
        isDanger={true}
      />
    </div>
  )
}`;

content = content.replace("    </div>\n  )\n}", replacement);

fs.writeFileSync(path, content, 'utf8');
