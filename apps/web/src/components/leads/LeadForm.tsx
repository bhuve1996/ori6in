'use client';

import { FormEvent, useMemo, useState } from 'react';
import {
  DPDP_CONSENT_LABEL,
  INTEREST_OPTIONS,
  LEAD_CALLBACK_PROMISE,
  LEAD_CONTACT_SUCCESS,
  catalogueById,
  catalogueGrouped,
  parseEmail,
  type LeadKind,
} from '@ori6in/shared';

export type LeadFormProps = {
  kind: LeadKind;
  programmeId?: string;
  programmeLabel?: string;
  interest?: string;
  eligibility?: Record<string, string>;
  onDone?: () => void;
};

const TITLES: Record<LeadKind, string> = {
  discovery: 'Book a free Discovery Session',
  brochure: 'Download the brochure',
  quote: 'Get a quote',
  contact: 'Write to us',
  eligibility: 'Where should we send the full read?',
};

const SUBMIT: Record<LeadKind, string> = {
  discovery: 'Book the session',
  brochure: 'Request the brochure',
  quote: 'Get a quote',
  contact: 'Send',
  eligibility: 'Send my read',
};

function successCopy(kind: LeadKind) {
  if (kind === 'contact') return LEAD_CONTACT_SUCCESS;
  if (kind === 'brochure') {
    return `Received. A counsellor will follow up personally — not a mailing list. ${LEAD_CALLBACK_PROMISE}`;
  }
  return LEAD_CALLBACK_PROMISE;
}

export function LeadForm({
  kind,
  programmeId,
  programmeLabel,
  interest: interestPrefill,
  eligibility,
  onDone,
}: LeadFormProps) {
  const presetProgramme =
    programmeLabel || (programmeId ? catalogueById(programmeId)?.label : '') || '';
  const groups = useMemo(() => catalogueGrouped(), []);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState(interestPrefill ?? '');
  const [programme, setProgramme] = useState(presetProgramme);
  const [qualification, setQualification] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const emailRequired = kind === 'eligibility';
  const emailCheck = useMemo(() => {
    if (!email.trim()) {
      return emailRequired
        ? ({ ok: false, message: 'Enter your email address' } as const)
        : ({ ok: true, email: '' } as const);
    }
    return parseEmail(email);
  }, [email, emailRequired]);
  const emailHint = emailTouched && !emailCheck.ok ? emailCheck.message : null;

  function touchField() {
    if (status === 'done' || status === 'error') {
      setStatus('idle');
      setFeedback('');
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setEmailTouched(true);
    setFeedback('');

    if (name.trim().length < 2) {
      setStatus('error');
      setFeedback('Please enter your name.');
      return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setStatus('error');
      setFeedback('Please enter a phone / WhatsApp number.');
      return;
    }
    if (!emailCheck.ok) {
      setStatus('error');
      setFeedback(emailCheck.message);
      return;
    }
    if (!consent) {
      setStatus('error');
      setFeedback('Please accept the data-consent line.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          interest:
            showInterest || kind === 'eligibility' ? interest.trim() || undefined : undefined,
          programme: kind === 'quote' ? programme.trim() || undefined : undefined,
          qualification: kind === 'quote' ? qualification.trim() || undefined : undefined,
          notes: kind === 'quote' ? notes.trim() || undefined : undefined,
          message: kind === 'contact' ? message.trim() || undefined : undefined,
          consent: true,
          eligibility,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        setStatus('error');
        setFeedback(data.message || 'Something went wrong. Try again.');
        return;
      }
      setStatus('done');
      setFeedback(successCopy(kind));
      onDone?.();
    } catch {
      setStatus('error');
      setFeedback('Network error. Try again in a moment.');
    }
  }

  const showInterest = kind === 'discovery' || kind === 'brochure' || kind === 'contact';
  const showQuoteFields = kind === 'quote';
  const showMessage = kind === 'contact';

  return (
    <form className="quote-form lead-form" onSubmit={onSubmit} noValidate>
      <h2 className="lead-form__title">{TITLES[kind]}</h2>
      <div className="quote-form__grid">
        <label className="quote-form__field">
          <span>Full name *</span>
          <input
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => {
              touchField();
              setName(e.target.value);
            }}
            required
          />
        </label>
        <label className="quote-form__field">
          <span>Phone / WhatsApp *</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => {
              touchField();
              setPhone(e.target.value);
            }}
            placeholder="+91 …"
            required
          />
        </label>
        <label className="quote-form__field">
          <span>{emailRequired ? 'Email *' : 'Email'}</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              touchField();
              setEmail(e.target.value);
            }}
            onBlur={() => setEmailTouched(true)}
            required={emailRequired}
            aria-invalid={emailHint ? true : undefined}
          />
          {emailHint ? <em className="quote-form__hint">{emailHint}</em> : null}
        </label>
        {showInterest ? (
          <label className="quote-form__field">
            <span>I’m interested in</span>
            <select
              name="interest"
              value={interest}
              onChange={(e) => {
                touchField();
                setInterest(e.target.value);
              }}
            >
              <option value="">Select…</option>
              {INTEREST_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {showQuoteFields ? (
          <>
            <label className="quote-form__field quote-form__field--span2">
              <span>Programme</span>
              <select
                name="programme"
                value={programme}
                onChange={(e) => {
                  touchField();
                  setProgramme(e.target.value);
                }}
              >
                <option value="">Select a programme…</option>
                {groups.map((group) => (
                  <optgroup key={group.id} label={group.label}>
                    {group.items.map((item) => (
                      <option key={item.id} value={item.label}>
                        {item.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <label className="quote-form__field quote-form__field--span2">
              <span>Current class / qualification</span>
              <input
                name="qualification"
                value={qualification}
                onChange={(e) => {
                  touchField();
                  setQualification(e.target.value);
                }}
              />
            </label>
          </>
        ) : null}
      </div>
      {showQuoteFields ? (
        <label className="quote-form__field quote-form__field--full">
          <span>Notes</span>
          <textarea
            name="notes"
            rows={3}
            value={notes}
            onChange={(e) => {
              touchField();
              setNotes(e.target.value);
            }}
          />
        </label>
      ) : null}
      {showMessage ? (
        <label className="quote-form__field quote-form__field--full">
          <span>Message</span>
          <textarea
            name="message"
            rows={4}
            value={message}
            onChange={(e) => {
              touchField();
              setMessage(e.target.value);
            }}
          />
        </label>
      ) : null}

      <label className="lead-form__consent" htmlFor="ori6in-dpdp">
        <input
          id="ori6in-dpdp"
          type="checkbox"
          checked={consent}
          onChange={(e) => {
            touchField();
            setConsent(e.target.checked);
          }}
        />
        <span>{DPDP_CONSENT_LABEL}</span>
      </label>

      <div className="quote-form__actions">
        <button className="btn btn-accent" type="submit" disabled={status === 'loading' || status === 'done'}>
          {status === 'loading' ? 'Sending…' : status === 'done' ? 'Sent' : SUBMIT[kind]}
        </button>
        {feedback ? (
          <p className={`quote-form__status${status === 'error' ? ' is-error' : ''}`} role="status">
            {feedback}
          </p>
        ) : (
          <p className="quote-form__note">
            {kind === 'quote'
              ? 'No public fees. A counsellor will send a personalised plan and fee.'
              : 'Complimentary first session for the student and parents together.'}
          </p>
        )}
      </div>
    </form>
  );
}
