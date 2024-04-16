const wait = async (ms: number) => {
  const waitTime = await new Promise(resolve => setTimeout(resolve, ms))
  return waitTime
}

export default wait
