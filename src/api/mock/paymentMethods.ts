export async function fetchPaymentMethods(): Promise<string[]> {
    console.log('Fetching data............')
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['Cash', 'Card', 'Bank Transfer', 'POS', 'Wallet'])
    }, 500)
  })
}
