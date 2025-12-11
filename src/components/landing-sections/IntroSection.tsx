export default function IntroSection() {
  return (
    <section className="w-full py-12 md:py-20 text-center px-4 md:px-6 bg-white">
      {/* Title */}
      <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight md:leading-snug">
        Why Print When You Can Go{" "}
        <span className="text-[#5a4fcf] block md:inline mt-1 md:mt-0">Paperless Instantly?</span>
      </h2>

      {/* Paragraph */}
      <p className="mt-4 md:mt-6 text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-center md:text-center">
        Go paperless to save money and time. Reduce waste, make billing easier, faster, and smarter for every transaction, while helping the environment.
      </p>
    </section>

  );
}
