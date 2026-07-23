interface WelcomeSlideProps {
  image: string;
  title: string;
  text: string;
}

export default function WelcomeSlide({ image, title, text }: WelcomeSlideProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-fade-in overflow-y-auto overflow-x-hidden custom-scrollbar">
      <div className="w-[clamp(12rem,40dvh,21rem)] aspect-square mb-[clamp(1rem,4dvh,3.5rem)] rounded-[32px] shadow-xl shadow-tzipur-sky/10 border-4 border-white bg-white p-2 flex items-center justify-center overflow-hidden shrink-0 mx-auto">
        <img src={image} alt={title} className="w-full h-full object-cover rounded-[24px]" />
      </div>
      
      <div className="shrink-0 w-full px-2 sm:px-4">
        <h2 className="text-[clamp(1.5rem,3.5dvh,2.25rem)] sm:text-4xl font-black text-tzipur-sky mb-[clamp(0.5rem,2dvh,1rem)] drop-shadow-sm leading-tight">{title}</h2>
        <p className="text-tzipur-brown/80 text-[clamp(1.1rem,2.8dvh,1.5rem)] sm:text-3xl leading-[1.3] sm:leading-[1.6] max-w-[420px] mx-auto font-medium">
          {text}
        </p>
      </div>
    </div>
  );
}
