import { Arrow, SocialIcon } from './icons/Social';

export default function ContactSection({ data }) {
  return (
    <section className="bay contact-bay" id="contact">
      <div className="wrap">
        <div className="bay-element-tag">
          <i
            style={{
              background:
                'linear-gradient(90deg, var(--air), var(--water), var(--earth), var(--fire))',
            }}
          />
          The four returning to one · Get in touch
        </div>

        <div className="contact-grid">
          <div className="reveal">
            <h2 className="contact-h">
              Let&apos;s build something with{' '}
              <span className="word">balance</span>.
            </h2>
            <p className="contact-blurb">{data.blurb}</p>
            <a className="contact-mail" href={`mailto:${data.email}`}>
              {data.email}
              <Arrow width={22} height={22} />
            </a>

            <div className="contact-links">
              {data.links.map((l) => (
                <a
                  key={l.label}
                  className="contact-link"
                  href={l.href}
                  data-el={l.el}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="ico">
                    <SocialIcon name={l.icon} />
                  </span>
                  <span className="lbl">{l.label}</span>
                  <span className="h">{l.handle}</span>
                  <Arrow width={14} height={14} />
                </a>
              ))}
            </div>
          </div>

          <aside className="balance-card reveal" style={{ '--rd': '180ms' }}>
            <div className="seal" />
            <h4>Balance is the work.</h4>
            <p>
              Code that moves like water, lasts like stone, breathes like air,
              and ships like fire.
            </p>
            <div className="availability">
              <i />
              Available · Q3 2026
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
