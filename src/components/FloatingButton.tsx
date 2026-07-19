interface Props {
  onClick: () => void;
}

export default function FloatingButton({ onClick }: Props) {
  return (
    <button className="widget-button" onClick={onClick}>
      💬
    </button>
  );
}