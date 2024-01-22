import clsx from "clsx";

export default function PlayerAvatar({ username, active }) {
  return (
    <div className={clsx("border-[3px] border-black w-[120px] h-[120px] bg-slate-600 rounded-xl grid place-items-center", active && "border-8 border-green-500 bg-green-700")}>
      <p>{username}</p>
    </div>
  );
}
