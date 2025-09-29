import { Transform } from 'class-transformer';

export function Capitalize() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  });
}

export function Trim() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    return value.trim();
  });
}

export function ToLower() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    return value.trim().toLowerCase();
  });
}

export function ToUpper() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    return value.trim().toUpperCase();
  });
}
