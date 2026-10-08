import sys

file_path = "app/app/clients/[slug]/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix the broken import/function
bad_chunk = """// Format dates strictly in IST (Asia/Kolkata) to avoid Vercel UTC shifts
import { CheckCircle } from 'lucide-react'

// Format dates strictly in IST (Asia/Kolkata) to avoid Vercel UTC shifts
function formatIST(dateInput: Date | string | number | undefined, formatStr: string) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  const offsetDiff = (330 + new Date().getTimezoneOffset()) * 60 * 1000;
  const targetTime = date.getTime() + offsetDiff;
  return format(new Date(targetTime), formatStr);
} from 'lucide-react'"""

good_chunk = """import { CheckCircle } from 'lucide-react'

// Format dates strictly in IST (Asia/Kolkata) to avoid Vercel UTC shifts
function formatIST(dateInput: Date | string | number | undefined, formatStr: string) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  const offsetDiff = (330 + new Date().getTimezoneOffset()) * 60 * 1000;
  const targetTime = date.getTime() + offsetDiff;
  return format(new Date(targetTime), formatStr);
}"""

content = content.replace(bad_chunk, good_chunk)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
