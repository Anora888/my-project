import { Emoji as BaseEmoji, EmojiStyle } from 'emoji-picker-react';

interface EmojiProps {
  symbol: string;
  size?: number; // Розмір у пікселях
  className?: string;
}

export default function Emoji({ symbol, size = 25, className = '' }: EmojiProps) {
  // Функція для отримання Unicode-коду з символу (наприклад, 🥳 -> 1f973)
  const getUnified = (emojiStr: string): string => {
    const codePoint = emojiStr.codePointAt(0);
    if (!codePoint) return '';
    return codePoint.toString(16);
  };

  const unified = getUnified(symbol);

  // Якщо код не знайдено, повертаємо порожній span
  if (!unified) {
    return <span className={className}>{symbol}</span>;
  }

  return (
    <span className={`emoji-wrapper ${className}`} style={{ display: 'inline-block', verticalAlign: 'middle', lineHeight: 0 }}>
      <BaseEmoji
        unified={unified}
        emojiStyle={EmojiStyle.APPLE} // Обов'язково стиль APPLE (Telegram)
        size={size}
      />
    </span>
  );
}