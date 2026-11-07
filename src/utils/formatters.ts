export function formatCurrency(amount: number, currency: 'INR' | 'USD' | 'EUR' | 'GBP' = 'INR'): string {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  }
  if (currency === 'EUR') {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
  }
  if (currency === 'GBP') {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(amount);
  }
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function formatCompactCurrency(amount: number, currency: 'INR' | 'USD' | 'EUR' | 'GBP' = 'INR'): string {
  if (currency === 'INR') {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} L`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)} k`;
    }
    return `₹${amount}`;
  }
  if (currency === 'USD') return `$${(amount / 1000).toFixed(0)}k`;
  if (currency === 'EUR') return `€${(amount / 1000).toFixed(0)}k`;
  return `${amount}`;
}

export function getDaysRemaining(deadlineStr: string, baseDateStr = '2026-11-07'): number {
  const base = new Date(baseDateStr);
  const target = new Date(deadlineStr);
  const diffTime = target.getTime() - base.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatDeadlineNotice(deadlineStr: string): {
  text: string;
  isUrgent: boolean;
  days: number;
} {
  const days = getDaysRemaining(deadlineStr);
  if (days < 0) {
    return { text: `Closed ${Math.abs(days)} days ago`, isUrgent: false, days };
  }
  if (days === 0) {
    return { text: 'Closes today!', isUrgent: true, days };
  }
  if (days === 1) {
    return { text: 'Closes tomorrow!', isUrgent: true, days };
  }
  if (days <= 7) {
    return { text: `Closes in ${days} days`, isUrgent: true, days };
  }
  if (days <= 30) {
    return { text: `${days} days left`, isUrgent: false, days };
  }
  const weeks = Math.round(days / 7);
  return { text: `${weeks} weeks left`, isUrgent: false, days };
}

export function formatDatePretty(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}
