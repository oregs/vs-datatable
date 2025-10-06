export async function fetchPaymentStatuses(): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['Pending', 'Processing', 'Completed', 'Failed'])
    }, 500)
  })
}
