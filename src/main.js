const ViewMan = (() => {
    const create = (name, { id = null, classes = null, childrens = null, html = null, placeholder = null }) => {
        const element = document.createElement(name);
        if (id) {
            element.id = id;
        }

        if (classes) {
            let classList = classes.split(" ");
            classList.map((cls) => element.classList.add(cls));
        }

        if (childrens) childrens.map((child) => element.appendChild(child));
        if (html) element.innerHTML = html;

        if (placeholder) {
            element.setAttribute("placeholder", placeholder);
        }

        return element;
    }

    const text = (data) => document.createTextNode(data);

    return {
        create,
        text,
    }
})();



class SelectBox {
    constructor(rootId, { url }) {
        this.root = document.getElementById(rootId);
        this.url = url;
        this.results = [];
    }

    init() {
        this.searchBar = ViewMan.create("input", {
            classes: "w-full bg-transparent outline-none",
            placeholder: "Start searching",
        });

        this.resultArea = ViewMan.create("div", {
            classes: "p-4 h-80 overflow-y-auto",
        });

        let modal = ViewMan.create('div', {
            classes: "fixed top-0 left-0 h-screen w-full bg-black/50 backdrop-blur-sm flex items-start justify-center",
            childrens: [
                ViewMan.create("div", {
                    classes: "bg-blue-50 w-1/2 rounded-lg mt-8",
                    childrens: [
                        // Header
                        ViewMan.create("div", {
                            classes: "flex border-b-2 border-gray-300",
                            childrens: [

                                // Search Icon
                                ViewMan.create("div", {
                                    classes: "p-4",
                                    html: `
                                    <svg width="20" height="20" viewBox="0 0 20 20">
                                        <path
                                            d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
                                            stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                    </svg>
                                    `
                                }),

                                // Search Bar
                                this.searchBar,

                                // Close Button
                                ViewMan.create("button", {
                                    classes: "px-4",
                                    html: `
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                        class="bi bi-x" viewBox="0 0 16 16">
                                        <path
                                            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                    `
                                })
                            ]
                        }),

                        // Body
                        this.resultArea,
                    ]
                })
            ],
        });

        this.root.appendChild(modal);


        this.searchBar.addEventListener('keyup', async (e) => {
            if (this.searchBar.value === "") return;

            await this.fetchResults();

            let resultListInHtml = ViewMan.create("div", {
                childrens: this.results.map(result => {

                    let resultItem = ViewMan.create('div', {
                        classes: 'font-bold',
                        childrens: [
                            ViewMan.text(result.title),
                        ]
                    });

                    resultItem.addEventListener("click", (e) => {
                        console.log(resultItem);
                    })

                    return resultItem;

                })
            })

            if (this.resultArea.hasChildNodes()) {
                this.resultArea.innerHTML = "";
            }

            this.resultArea.appendChild(resultListInHtml);
        })
    }

    async fetchResults() {
        const res = await fetch(this.url);
        this.results = await res.json();
    }
}