const Application = {
    save() {
        const object = {
            columns: {
                lastID: Column.lastID,
                items: [],
            },
            notes: {
                lastID: Note.lastID,
                items: [],
            },
        };

        $(".column").each(function (index, columnElement) {
            const column = {
                id: parseInt($(columnElement).attr("data-column-id")),
                title: $(columnElement).find(".column-header").text(),
                notes: [],
            };

            $(columnElement).find(".note").each(function (index, noteElement) {
                column.notes.push(parseInt($(noteElement).attr("data-note-id")));
            });

            object.columns.items.push(column);
        });

        $(".note").each(function (index, noteElement) {
            const note = {
                id: parseInt($(noteElement).attr("data-note-id")),
                content: $(noteElement).text(),
            };

            object.notes.items.push(note);
        });

        const json = JSON.stringify(object);
        localStorage.setItem("trello", json);
    },

    load() {
        if (!localStorage.getItem("trello")) {
            return;
        }

        const object = JSON.parse(localStorage.getItem("trello"));

        getContentNote = (id) => object.notes.items.find((note) => note.id == id);
        Column.lastID = object.columns.lastID;
        Note.lastID = object.notes.lastID;
        $(".columns").html("");

        $(object.columns.items).each(function (index, columnElement) {
            const column = new Column(columnElement.id, columnElement.title);

            $(columnElement.notes).each(function (index, noteElement) {
                const { id, content } = getContentNote(noteElement);
                const note = new Note(id, content);
                $(note.element).appendTo($(column.element).find(".notes"));
            });
        });
    },
};
