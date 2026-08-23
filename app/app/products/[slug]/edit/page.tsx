export const dynamic = 'force-dynamic'
import { updateProduct } from '../../actions'
import ProductForm from '../../components/ProductForm'
import prisma from '@/utils/prisma'
import { notFound } from 'next/navigation'

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const product = await prisma.product.findUnique({
    where: { slug }
  })

  if (!product) {
    notFound()
  }

  // Create a bound action that includes the ID
  const updateProductWithId = updateProduct.bind(null, product.id)

  return <ProductForm initialData={product} action={updateProductWithId} title="Edit Product/Service" />
}
