import { useSummary } from "use-react-summary";

const MyComponent = () => {
  const text = `For instance, choose casual shirts for men with bright/light colors when you are out for an outdoor setting that is less formal and more fun. For instance, as a beach party outfit, a friend's get-together or even a date with a fiancé who is more into fun than formalities! On the other hand, go for formal shirts for men with specific whites, greys, black, navy, etc for an official meet or some other as per the formal events like a wedding or office party like gold, maroon, red or any other as per your personal choice.`;
  const { summarizeText, isLoading, error } = useSummary({ text, words: 50 });

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {summarizeText}
    </div>
  );
};
export default MyComponent;
