const Razorpay = require('razorpay');

const rzp = new Razorpay({
  key_id: 'rzp_test_TZXqTeAGCJbq4b',
  key_secret: 'OWYe66cbMt6OWKFEsAsJxug9',
});

async function test() {
  try {
    const rzpCustomer = await rzp.customers.create({
      name: 'Test User',
      email: 'razorpay-review@invoiceflowpro.com',
      contact: '9999999999',
      fail_existing: '0'
    });
    console.log('Customer:', rzpCustomer.id);
  } catch (err) {
    console.error('Customer Create Error:', err);
  }
}

test();
