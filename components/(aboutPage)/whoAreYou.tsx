import Image from "next/image";

export default function AboutWhoWeAre() {
  return (
    <section className="w-full bg-white" aria-labelledby="who-we-are-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16 xl:gap-20">
          <div className="flex-1 lg:max-w-[45%]">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md">
              <Image
                src="/(aboutusPage)/whoarewe.jpg"
                alt="SGOI Pvt Ltd office building"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <h2
              id="who-we-are-heading"
              className="text-2xl sm:text-3xl font-bold text-black mb-5 leading-snug"
            >
              Who We Are
            </h2>

            <div className="flex flex-col gap-4">
              <p
                className="text-base leading-relaxed"
                style={{ color: "#1a1a1a" }}
              >
                SGOI Pvt Ltd is a trusted supplier and distributor of quality
                products and business solutions across India. We are committed
                to delivering reliable products, transparent business practices,
                and efficient customer support for both businesses and
                individual customers.
              </p>

              <p
                className="text-base leading-relaxed"
                style={{ color: "#1a1a1a" }}
              >
                Our mission is to provide a smooth purchasing experience through
                dependable service, secure transactions, and timely order
                processing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
