export function DashboardPreview() {
    return (
      <div className="relative bg-white dark:bg-zinc-950 rounded-xl shadow-xl p-6 max-w-5xl mx-auto transform hover:-translate-y-1 transition-transform duration-300">
        <div className="aspect-[16/9] w-full relative overflow-hidden rounded-lg">
          <img
            src="/preview.png"
            alt="Compliance dashboard preview"
            className="w-full object-cover"
          />
        </div>
      </div>
    )
  }
  