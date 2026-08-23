import { getExpenses } from './actions'
import { getBanks } from '../settings/actions'
import ExpensesClient from './ExpensesClient'

export const dynamic = 'force-dynamic'

export default async function ExpensesPage() {
  const expenses = await getExpenses()
  const banks = await getBanks()

  return <ExpensesClient initialExpenses={expenses} banks={banks} />
}
