import re
with open('prisma/schema_bottom.prisma', 'r') as f:
    text = f.read()

match = re.search(r'model User \{.*', text, re.DOTALL)
if match:
    with open('prisma/schema_bottom.prisma', 'w') as f:
        f.write(match.group(0))
