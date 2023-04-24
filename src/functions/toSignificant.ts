export const convertNumber = (n: any) => {
  if (!n || n === undefined || n === null) return
  var sign = +n < 0 ? "-" : "",
    toStr = n.toString()
  if (!/e/i.test(toStr)) {
    return n
  }
  var [lead, decimal, pow] = n
    .toString()
    .replace(/^-/, "")
    .replace(/^([0-9]+)(e.*)/, "$1.$2")
    .split(/e|\./)
  return +pow < 0
    ? sign +
    "0." +
    "0".repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) +
    lead +
    decimal
    : sign +
    lead +
    (+pow >= decimal.length
      ? decimal + "0".repeat(Math.max(+pow - decimal.length || 0, 0))
      : decimal.slice(0, +pow) + "." + decimal.slice(+pow))
}

export const toSignificantDigits = (
  fig: any,
  precision = 6,
  roundInput = false
): any => {
  if (!fig || fig === undefined || fig === null) return

  if (roundInput) {
    let unroundedDec = String(convertNumber(fig))
      .replace(/^0+|0+$/g, "")
      .split(".")[1]
    unroundedDec = unroundedDec === undefined ? "" : unroundedDec
    let leadingDecimalZeros =
      unroundedDec.length - unroundedDec.replace(/^0+|0+$/g, "").length
    leadingDecimalZeros = Number(fig) >= 1 ? 0 : leadingDecimalZeros
    const roundPrecision = 10 ** (precision + leadingDecimalZeros)
    fig = Math.round(Number(fig) * roundPrecision) / roundPrecision
    fig = fig === Math.floor(fig) ? String(fig + ".") : fig
  }

  let [intValue, decimalValue] = String(convertNumber(fig))
    .replace(/^0+|0+$/g, "")
    .split(".")
  if (decimalValue === undefined || decimalValue === "") {
    return intValue === "" ? "0" : String(convertNumber(fig)).split(".")[0]
  }

  let leadingDecimalZeros =
    decimalValue.length - decimalValue.replace(/^0+|0+$/g, "").length
  if (intValue === "") {
    intValue = "0"
    leadingDecimalZeros += 1
  } else if (intValue.length >= precision) {
    return intValue
  }
  const significantPrecision = precision - intValue.length + leadingDecimalZeros
  const trimmedValue = (
    intValue +
    "." +
    decimalValue.slice(0, significantPrecision)
  )
    .replace(/^|0+$/g, "")
    .replace(/\.$/, "")
  return trimmedValue === "" ? "0" : trimmedValue
}
