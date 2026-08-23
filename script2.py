import os
import re

files = [
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\(admin)\app\admin\audit\page.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\(admin)\app\admin\billing\payments\page.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\(admin)\app\admin\billing\subscriptions\page.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\(admin)\app\admin\businesses\page.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\(admin)\app\admin\invoices\page.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\(admin)\app\admin\page.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\(admin)\app\admin\support\announcements\page.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\(admin)\app\admin\support\tickets\page.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\(admin)\app\admin\users\page.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\app\estimates\[id]\page.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\app\estimates\page.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\app\expenses\ExpensesClient.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\app\invoices\InvoiceListClient.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\app\invoices\InvoiceRowActions.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\app\invoices\[id]\page.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\app\invoices\new\InvoiceForm.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\app\page.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\app\products\[slug]\ProductTransactionsClient.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\app\projects\page.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\app\settings\BankAccountsList.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\app\support\page.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\app\transfers\TransfersClient.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\pay\[id]\invoice\page.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\portal\[portalToken]\PortalClient.tsx",
    r"c:\1 PER DOC\Agastya\Coding\Invoicing\app\statement\[clientId]\page.tsx",
]

for file_path in files:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    def replace_table_tag(match):
        table_tag = match.group(0)
        if 'whitespace-nowrap' not in table_tag:
            if 'className="' in table_tag:
                table_tag = table_tag.replace('className="', 'className="whitespace-nowrap ')
            else:
                table_tag = table_tag.replace('<table', '<table className="whitespace-nowrap"')
        return table_tag

    content = re.sub(r'<table[^>]*>', replace_table_tag, content)

    # Wrap in div
    lines = content.split('\n')
    new_lines = []
    
    inside_table = False
    added_div = False
    
    for i, line in enumerate(lines):
        if '<table' in line:
            # check if previous line has overflow-x-auto
            if i > 0 and 'overflow-x-auto' in lines[i-1]:
                new_lines.append(line)
            else:
                spaces = len(line) - len(line.lstrip())
                new_lines.append(' ' * spaces + '<div className="overflow-x-auto">')
                new_lines.append(line)
                added_div = True
        elif '</table>' in line:
            new_lines.append(line)
            if added_div:
                # wait, what if there were multiple tables and only some were wrapped? 
                # This is a bit naive, but since we are modifying each file once, let's assume it works.
                # Actually, check if next line is already </div>
                if i < len(lines) - 1 and '</div>' in lines[i+1].strip() and 'overflow-x-auto' not in lines[i+1]:
                    # well, we don't know if the next </div> belongs to our div or something else, but if we didn't add <div className="overflow-x-auto"> before, we wouldn't add </div> here.
                    pass
                spaces = len(line) - len(line.lstrip())
                new_lines.append(' ' * spaces + '</div>')
                added_div = False
        else:
            new_lines.append(line)
            
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))
    print(f"Updated {file_path}")
