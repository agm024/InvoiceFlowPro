import os
import re

directories_to_check = ['app/app', 'components']
keywords = ['clients', 'invoices', 'projects', 'products', 'estimates', 'expenses', 'reports', 'transfers', 'settings', 'quotations']

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    for keyword in keywords:
        # href="/keyword
        content = re.sub(r'href=(["\'])/' + keyword, r'href=\g<1>/app/' + keyword, content)
        # href={`/keyword
        content = re.sub(r'href=\{`/' + keyword, r'href={`/app/' + keyword, content)
        # router.push('/keyword
        content = re.sub(r'push\((["\'])/' + keyword, r'push(\g<1>/app/' + keyword, content)
        # router.push(`/keyword
        content = re.sub(r'push\(`/' + keyword, r'push(`/app/' + keyword, content)
        # window.location.href = `/keyword
        content = re.sub(r'window\.location\.href\s*=\s*`/' + keyword, r'window.location.href = `/app/' + keyword, content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed: {filepath}")

for d in directories_to_check:
    for root, dirs, files in os.walk(d):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                fix_file(os.path.join(root, file))

print("Done running script.")
