import Image from "next/image";

function ExpandableTextArea({ value, setValue }) {
  return (
    <div
      className="grid text-lg after:px-3.5 after:py-2.5 [&>textarea]:text-inherit after:text-inherit
                 [&>textarea]:resize-none [&>textarea]:overflow-hidden [&>textarea]:[grid-area:1/1/2/2]
                 after:[grid-area:1/1/2/2] after:whitespace-pre-wrap after:invisible after:content-[attr(data-cloned-val)_'_']
                 after:border"
    >
      <textarea
        className="w-full border border-transparent appearance-none outline-none resize-none"
        placeholder="What's happening?"
        name="message"
        id="message"
        rows="2"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onInput={(e) =>
          (e.target.parentNode.dataset.clonedVal = e.target.value)
        }
      />
    </div>
  );
}

export default function TweetInputArea({ value, setValue }) {
  return (
    <div class="rounded-xl bg-white w-full border focus-within:border-black shadow-sm">
      <div class="flex p-4">
        <div>
          <img
            class="rounded-full w-10"
            alt="Avatar"
            src="https://static.vecteezy.com/ti/vecteur-libre/t2/9292244-icone-d-avatar-par-defaut-vecteur-de-l-utilisateur-des-medias-sociaux-vectoriel.jpg"
          />
        </div>

        <div class="ml-3 flex flex-col w-full">
          <ExpandableTextArea value={value} setValue={setValue} />
        </div>
      </div>
    </div>
  );
}
