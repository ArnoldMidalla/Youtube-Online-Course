export default function Loading () {
  return (
    <div className="flex flex-col gap-4 bg-white items-center justify-center h-screen">
      {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div> */}
      <img
        src="https://media1.tenor.com/m/rOOFTXXw5QEAAAAC/loading-gun-loading.gif"
        alt=""
        className="px-8 rounded-xl lg:rounded-none lg:px-0"
      />
      <p className="text-black text-1xl">Thinking...</p>
    </div>
  );
}
