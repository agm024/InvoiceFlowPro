const Razorpay = require('razorpay');

const rzp = new Razorpay({
  key_id: 'rzp_test_TZXqTeAGCJbq4b',
  key_secret: 'OWYe66cbMt6OWKFEsAsJxug9',
});

async function test() {
  try {
    const plans = await rzp.plans.all();
    const plan = plans.items[0];
    console.log('Using plan:', plan.id);
    
    const sub = await rzp.subscriptions.create({
      plan_id: plan.id,
      total_count: 12,
      customer_notify: 1
    });
    console.log('Created sub:', sub.id);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
