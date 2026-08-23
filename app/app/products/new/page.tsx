export const dynamic = 'force-dynamic'
import { createProduct } from '../actions'
import ProductForm from '../components/ProductForm'

export default function NewProductPage() {
  return <ProductForm action={createProduct} title="Add New Product/Service" />
}

