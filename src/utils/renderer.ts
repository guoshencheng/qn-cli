

export const hostnames = (value: string[], bucket?: string) => {
  console.log(`\n fetched hostnames map to ${bucket || 'this bucket'}`)
  value.forEach(hostname => {
    console.log(`*  ${hostname}`);
  })
  console.log('\n');
}
