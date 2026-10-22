import { Link } from 'react-router-dom';
import { linkParts } from '../crosslink';

export function LinkedText({ text, exceptId }: { text: string; exceptId?: string }) {
  return linkParts(text, exceptId).map((part, index) =>
    part.entryId ? (
      <Link key={index} className="crosslink" to={`/substance/${part.entryId}`}>
        {part.text}
      </Link>
    ) : (
      <span key={index}>{part.text}</span>
    ),
  );
}

export function linkedHtml(text: string, exceptId?: string): string {
  return linkParts(text, exceptId)
    .map((part) =>
      part.entryId
        ? `<a class="crosslink" href="/substance/${part.entryId}">${escapeHtml(part.text)}</a>`
        : escapeHtml(part.text),
    )
    .join('');
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
