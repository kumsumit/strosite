export const initialBusiness = { phase: 0, quantity: 2, credit: false, delivery: false, present: true };
export type BusinessState = typeof initialBusiness;
export type BusinessAction = { type: 'next' | 'reset' | 'delivery' | 'attendance' } | { type: 'quantity'; value: number } | { type: 'credit'; value: boolean };
export function businessReducer(state: BusinessState, action: BusinessAction): BusinessState {
  switch (action.type) {
    case 'next': return { ...state, phase: Math.min(5, state.phase + 1) };
    case 'reset': return { ...initialBusiness };
    case 'quantity': return state.phase === 0 ? { ...state, quantity: Math.min(8, Math.max(1, Math.trunc(action.value) || 1)) } : state;
    case 'credit': return state.phase === 0 ? { ...state, credit: action.value } : state;
    case 'delivery': return state.phase === 0 || state.phase === 5 ? { ...state, delivery: true } : state;
    case 'attendance': return { ...state, present: !state.present };
  }
}
export function businessSnapshot(state: BusinessState) {
  const amount = state.quantity * 590;
  return {
    amount,
    stock: 42 + (state.delivery ? 8 : 0) - (state.phase >= 3 ? state.quantity : 0),
    balance: 14200 + (state.phase >= 4 && state.credit ? amount : 0),
    sales: 24850 + (state.phase >= 5 ? amount : 0),
    invoices: 32 + (state.phase >= 5 ? 1 : 0),
    payment: state.phase < 4 ? 'Awaiting sale' : state.credit ? 'Added to account' : 'Payment recorded',
  };
}
export const money = (value: number) => `₹${value.toLocaleString('en-IN')}`;
