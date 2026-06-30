import Image from "next/image";
import Header from "@/components/Header";
import MobileReserveBar from "@/components/MobileReserveBar";
import CtaButton from "@/components/CtaButton";
import PhoneLink from "@/components/PhoneLink";
import ShowcaseVideo from "@/components/ShowcaseVideo";
import ScrollReveal from "@/components/ScrollReveal";
import RegistrationForm from "@/components/RegistrationForm";
import {
  BRAND,
  HERO,
  INTRO,
  TOPICS,
  TOPICS_HEADING,
  WHY_ATTEND,
  VIDEO,
  SHOWCASE_VIDEOS,
  SESSIONS,
  LOCATION,
  SPEAKER,
  SPEAKER_PHOTO,
  DISCLOSURE,
  PARTNERS,
  LOGO_SRC,
} from "@/lib/seminar";

export default function Home() {
  return (
    <>
      <Header />
      <ScrollReveal />

      <main id="top" className="flex-1 pb-24 sm:pb-0">
        {/* ---------------------------------------------------------------- Hero */}
        <section className="relative flex min-h-[600px] items-center overflow-hidden bg-navy text-white lg:min-h-[680px]">
          {/* Background banner — multi-generational family */}
          <Image
            src="/images/hero-cover.png"
            alt="A happy multi-generational family enjoying a meal together"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Black overlay — dark on the left for legible text, fading right to reveal the family */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
          />
          <div className="relative z-10 mx-auto w-full max-w-content px-4 py-20 sm:px-6 sm:py-28">
            <div className="animate-fade-up flex flex-wrap gap-2.5">
              {HERO.badges.map((badge) => (
                <a
                  key={badge.label}
                  href={badge.href}
                  target={badge.external ? "_blank" : undefined}
                  rel={badge.external ? "noopener noreferrer" : undefined}
                  className="rounded-full border border-white/50 bg-white/15 px-3.5 py-1.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/25"
                >
                  {badge.label}
                </a>
              ))}
            </div>
            <h1
              className="animate-fade-up mt-6 max-w-3xl text-4xl font-extrabold tracking-tight !text-white drop-shadow-md sm:text-5xl lg:text-6xl"
              style={{ animationDelay: "0.1s" }}
            >
              {HERO.headline}
            </h1>
            <p
              className="animate-fade-up mt-6 max-w-2xl text-lg text-white/85 sm:text-xl"
              style={{ animationDelay: "0.2s" }}
            >
              {HERO.subheadline}
            </p>
            <div
              className="animate-fade-up mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
              style={{ animationDelay: "0.3s" }}
            >
              <CtaButton
                location="hero"
                className="text-lg shadow-lg ring-2 ring-white/50"
              >
                {HERO.cta}
              </CtaButton>
              <PhoneLink
                location="hero"
                className="inline-flex items-center justify-center gap-2 text-base font-semibold text-white/90 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.05-.24 11.36 11.36 0 003.57.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.57 1 1 0 01-.24 1.05l-2.2 2.17z" />
                </svg>
                Reserve by phone: {BRAND.phoneDisplay}
              </PhoneLink>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- Introduction */}
        <section id="about" className="bg-white">
          <div className="reveal mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                Why It Matters
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl">Why an Estate Plan Matters</h2>
              <p className="mt-6 text-lg leading-relaxed text-charcoal/85">{INTRO}</p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Avoid Probate",
                  desc: "Skip the delays, expenses, and frustration of Probate Court.",
                  icon: (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 11.5l2 2 3.5-3.5" />
                    </>
                  ),
                },
                {
                  title: "Protect Your Loved Ones",
                  desc: "Make sure your family is cared for and never left unprepared.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.49-2.1-4.5-4.69-4.5-1.93 0-3.6 1.13-4.31 2.73-.72-1.6-2.38-2.73-4.31-2.73C5.1 3.75 3 5.76 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  ),
                },
                {
                  title: "Preserve Your Wealth",
                  desc: "Keep more of what you've built and pass it on intact.",
                  icon: (
                    <>
                      <rect x="5" y="11" width="14" height="10" rx="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V8a4 4 0 118 0v3" />
                    </>
                  ),
                },
                {
                  title: "Transfer on Your Terms",
                  desc: "Ensure your assets go exactly where you want them to.",
                  icon: (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3H7a1 1 0 00-1 1v16a1 1 0 001 1h10a1 1 0 001-1V8l-4-5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l2 2 4-4" />
                    </>
                  ),
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-navy/5 bg-cloud p-6 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green/10 text-green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-7 w-7" aria-hidden="true">
                      {item.icon}
                    </svg>
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-navy">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/75">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- Video */}
        <section id="video" className="bg-cloud">
          <div className="reveal mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="text-center text-3xl sm:text-4xl">{VIDEO.sectionTitle}</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-slate">
              A short introduction to the strategies we&apos;ll cover at the seminar.
            </p>
            <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl bg-navy shadow-lg ring-1 ring-navy/10">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${VIDEO.id}?rel=0`}
                title={VIDEO.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <p className="mx-auto mt-5 max-w-xl text-center text-charcoal/80">
              An Estate Planning overview from our President, Chief Counsel of ITS.
            </p>
          </div>
        </section>

        {/* -------------------------------------------------- Video Showcase */}
        <section id="videos" className="bg-white">
          <div className="reveal mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                Free Educational Videos
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl">Watch &amp; Learn</h2>
              <p className="mt-4 text-lg text-charcoal/80">
                Short videos on why planning ahead matters — share them with
                someone you care about.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-2">
              {SHOWCASE_VIDEOS.map((video) => (
                <article key={video.src} className="flex flex-col">
                  <ShowcaseVideo src={video.src} title={video.title} />
                  <h3 className="mt-5 text-xl font-bold text-navy">
                    {video.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-charcoal/80">
                    {video.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- Topics Covered */}
        <section
          id="topics"
          className="relative overflow-hidden bg-gradient-to-b from-green-100/60 to-white"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-green/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-green/10 blur-3xl"
          />
          <div className="reveal relative mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                What We&apos;ll Cover
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl">What You&apos;ll Learn</h2>
              <p className="mt-4 text-lg text-charcoal/80">{TOPICS_HEADING}</p>
            </div>

            <ul className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2">
              {TOPICS.map((topic, i) => (
                <li
                  key={topic}
                  className="group flex items-start gap-4 rounded-xl border border-navy/5 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-green/30 hover:shadow-md"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green text-base font-bold text-white shadow-sm">
                    {i + 1}
                  </span>
                  <span className="pt-1.5 font-medium leading-snug text-charcoal/90">
                    {topic}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* --------------------------------------------------------- Why Attend */}
        <section className="bg-navy text-white">
          <div className="reveal mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
            <h2 className="text-3xl !text-white sm:text-4xl">Why Attend</h2>
            <p className="mt-6 text-lg text-white/85">{WHY_ATTEND}</p>
            <div className="mt-8 flex justify-center">
              <CtaButton location="why_attend" className="text-lg">
                Reserve Your Free Seat
              </CtaButton>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ Event Details */}
        <section id="details" className="bg-cloud">
          <div className="reveal mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="text-center text-3xl sm:text-4xl">Event Details</h2>
            <p className="mt-3 text-center text-slate">
              Choose the session that works best for you.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {SESSIONS.map((s, i) => (
                <div
                  key={s.id}
                  className="flex flex-col rounded-xl border border-navy/10 bg-white p-6 shadow-sm"
                >
                  <span className="text-sm font-semibold uppercase tracking-wider text-green-700">
                    Session {i + 1}
                  </span>
                  <span className="mt-3 font-heading text-xl font-bold text-navy">
                    {s.day}
                  </span>
                  <span className="mt-1 text-2xl font-bold text-charcoal">{s.time}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 grid items-center gap-6 rounded-xl border border-navy/10 bg-white p-6 sm:grid-cols-[1fr_auto] sm:p-8">
              <div>
                <h3 className="text-xl">Location</h3>
                <address className="mt-2 not-italic text-charcoal/90">
                  <span className="font-semibold text-navy">{LOCATION.name}</span>
                  <br />
                  {LOCATION.street}
                  <br />
                  {LOCATION.city}, {LOCATION.state} {LOCATION.zip}
                </address>
                <p className="mt-4 text-sm text-slate">
                  Seating is limited. Advance registration is recommended.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href={LOCATION.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-navy/20 px-5 py-3 font-semibold text-navy transition hover:border-green hover:text-green-700"
                >
                  View on Map
                </a>
                <CtaButton location="details">Reserve Your Seat</CtaButton>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------- Speaker */}
        <section id="speaker" className="bg-cloud">
          <div className="reveal mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                Meet Our Speaker
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl">Learn From an Experienced Guide</h2>
            </div>

            <div className="mx-auto mt-12 grid max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-navy/10 md:grid-cols-2">
              {/* Big speaker photo */}
              <div className="relative min-h-[360px] sm:min-h-[460px] md:min-h-[600px]">
                <Image
                  src={SPEAKER_PHOTO}
                  alt={`${SPEAKER.name}, seminar speaker`}
                  fill
                  priority={false}
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover object-top"
                />
              </div>

              {/* Bio panel */}
              <div className="flex flex-col justify-center bg-navy p-8 text-white sm:p-10 lg:p-12">
                <h3 className="text-3xl !text-white">{SPEAKER.name}</h3>
                <p className="mt-2 font-semibold text-green">
                  Estate &amp; Retirement Planning Educator
                </p>
                <div className="mt-4 h-1 w-16 rounded bg-green" />
                <p className="mt-6 leading-relaxed text-white/85">{SPEAKER.bio}</p>

                <ul className="mt-8 space-y-3">
                  {[
                    "30+ years owning and operating a business",
                    "Licensed health & life agent in Kentucky, Indiana & other states",
                    "Specializes in wealth transfer & end-of-life planning",
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm text-white/90">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        className="mt-0.5 h-5 w-5 shrink-0 text-green"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- Registration */}
        <section id="register" className="scroll-mt-20 bg-cloud">
          <div className="reveal mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl sm:text-4xl">Reserve Your Free Seat</h2>
              <p className="mt-4 text-lg text-charcoal/80">
                Complete the form below and we&apos;ll save your spot. It only
                takes a minute.
              </p>
            </div>
            <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-navy/10 bg-white p-6 shadow-sm sm:p-8">
              <RegistrationForm />
            </div>
          </div>
        </section>


        {/* -------------------------------------------------------- Disclosure */}
        <section className="bg-white">
          <div className="reveal mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16">
            <div className="overflow-hidden rounded-2xl border border-navy/10 bg-cloud shadow-sm">
              {/* Header strip */}
              <div className="flex items-center gap-3 border-b border-navy/10 bg-navy px-6 py-4 sm:px-8">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-green ring-1 ring-white/15">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 11.5l2 2 3.5-3.5" />
                  </svg>
                </span>
                <h2 className="text-base font-bold uppercase tracking-wider !text-white sm:text-lg">
                  Important Disclosure
                </h2>
              </div>

              {/* Body */}
              <div className="space-y-4 px-6 py-6 sm:px-8 sm:py-8">
                {DISCLOSURE.map((para) => (
                  <p
                    key={para}
                    className="border-l-2 border-green/40 pl-4 text-sm leading-relaxed text-slate"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- Partners */}
        <section className="border-t border-navy/10 bg-cloud">
          <div className="reveal mx-auto max-w-content px-4 py-12 sm:px-6">
            <p className="text-center text-sm font-semibold uppercase tracking-wider text-slate">
              In partnership with
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
              {PARTNERS.map((partner) => (
                <div
                  key={partner.name}
                  className="flex h-24 items-center justify-center rounded-lg bg-white p-5 ring-1 ring-navy/5"
                >
                  <Image
                    src={partner.src}
                    alt={partner.name}
                    width={220}
                    height={90}
                    className="max-h-full w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------------- Footer */}
      <footer className="bg-navy-900 text-white/80">
        <div className="mx-auto grid max-w-content gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
          <div>
            <div className="inline-flex rounded-lg bg-white p-4 shadow-sm">
              <Image
                src={LOGO_SRC}
                alt={`${BRAND.name} Financial Services`}
                width={471}
                height={229}
                className="h-14 w-auto"
              />
            </div>
            <p className="mt-4 text-sm uppercase tracking-wider text-green">
              {BRAND.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold !text-white">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                Phone:{" "}
                <PhoneLink location="footer" className="font-semibold text-white hover:text-green">
                  {BRAND.phoneDisplay}
                </PhoneLink>
              </li>
              <li>
                Email:{" "}
                <a
                  href={`mailto:${BRAND.email}`}
                  className="font-semibold text-white hover:text-green"
                >
                  {BRAND.email}
                </a>
              </li>
              <li>
                Website:{" "}
                <a
                  href={BRAND.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white hover:text-green"
                >
                  {BRAND.website}
                </a>
              </li>
            </ul>

            <h3 className="mt-6 text-base font-semibold !text-white">
              Visit Our Office
            </h3>
            <a
              href={BRAND.office.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-sm not-italic text-white/80 transition hover:text-green"
            >
              <address className="not-italic">
                {BRAND.office.line1}
                <br />
                {BRAND.office.line2}
              </address>
            </a>
            <a
              href={BRAND.office.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-3 block w-full max-w-xs overflow-hidden rounded-lg ring-1 ring-white/15"
              aria-label="View our office on the map"
            >
              <Image
                src="/images/office.jpeg"
                alt={`${BRAND.name} office building`}
                width={711}
                height={533}
                className="h-auto w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </a>
          </div>

          <div className="md:justify-self-end">
            <h3 className="text-base font-semibold !text-white">Scan Portfolio</h3>
            <div className="mt-4 flex flex-col items-start gap-3">
              <Image
                src="/images/qr.jpeg"
                alt={`Scan to view the ${BRAND.name} business card and portfolio`}
                width={128}
                height={128}
                className="h-32 w-32 rounded-lg bg-white p-1.5 shadow-sm"
              />
              <p className="text-xs text-white/60">
                Scan to view our digital business card &amp; portfolio
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-content px-4 py-5 text-center text-xs text-white/50 sm:px-6">
            © 2026 {BRAND.name}. For educational purposes only.
          </div>
        </div>
      </footer>

      <MobileReserveBar />
    </>
  );
}
