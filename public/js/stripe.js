/* eslint-disable no-undef */

import axios from 'axios';
import { showAlert } from './alerts';

// const stripe = Stripe(
//   'pk_test_51Pg2LvG34qttp9TNhAEBvOEncjbbMQWQswKWJ4sWeedDt6iGZOIeH20cUjMXXxWIGcQqmwZjwEPHtCHpnbB0jWFZ002IByMZc6',
// );
export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    console.log(session);
    showAlert('error', err);
  }
};
