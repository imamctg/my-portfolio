// lib/utils.ts
// export function cn(...classes: (string | false | null | undefined)[]) {
//   return classes.filter(Boolean).join(' ')
// }

// lib/utils.ts
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ')
}
