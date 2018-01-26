export default function Send(rpc) {
  return ({
    wallet,
    source,
    destination,
    amount,
  }) =>
    rpc('send', {
      wallet,
      source,
      destination,
      amount,
    });
}
