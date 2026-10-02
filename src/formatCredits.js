const creditFormatter = new Intl.NumberFormat("en-US");

function formatCredits(amount) {
  return creditFormatter.format(amount);
}

export default formatCredits;