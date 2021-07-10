class Note {

    constructor(id = null, content = "New") {

        if (id) {
            this.element = $("<div>", { class: "note", draggable: "true", "data-note-id": id, text: content });
        } else {
            Note.lastID++;
            this.element = $("<div>", { class: "note", draggable: "true", "data-note-id": Note.lastID, text: content });
        }

        $(this.element).dblclick(function () {
            $(this).attr("contenteditable", true);
            $(this).removeAttr("draggable");
            $(this).closest(".column").removeAttr("draggable");
            $(this).focus();
        });

        $(this.element).blur(function () {
            $(this).removeAttr("contenteditable");
            $(this).attr("draggable", true);
            $(this).closest(".column").attr("draggable", true);

            if (!$(this).text().trim().length) {
                $(this).remove();
            }

            Application.save();
        });

        $(this.element).on("dragstart", this.dragstart.bind(this));
        $(this.element).on("dragend", this.dragend.bind(this));
        $(this.element).on("dragenter", this.dragenter.bind(this));
        $(this.element).on("dragleave", this.dragleave.bind(this));
        $(this.element).on("dragover", this.dragover.bind(this));
        $(this.element).on("drop", this.drop.bind(this));
    }

    dragstart() {
        Note.dragged = this.element;

        setTimeout(function () {
            $(Note.dragged).addClass("hide");
        }, 0);

        event.stopPropagation();
    }

    dragend() {
        Note.dragged = null;

        $(this.element).removeClass("hide");

        event.stopPropagation();
    }

    dragenter() {
        if (!Note.dragged || this.element == Note.dragged) {
            return;
        }

        $(this.element).addClass("under-note");
    }

    dragleave() {
        if (!Note.dragged || this.element == Note.dragged) {
            return;
        }

        $(this.element).removeClass("under-note");
    }

    dragover() {
        if (!Note.dragged || this.element == Note.dragged) {
            return;
        }

        event.preventDefault();
    }

    drop() {
        if (!Note.dragged || this.element == Note.dragged) {
            return;
        }

        $(".note").removeClass("under-note");

        if ($(this.element).parent()[0] == $(Note.dragged).parent()[0]) {

            if ($(this.element).index() > $(Note.dragged).index()) {
                $(Note.dragged).insertAfter($(this.element));
            } else {
                $(Note.dragged).insertBefore($(this.element));
            }
        } else {
            $(Note.dragged).insertBefore($(this.element));
        }

        Application.save();

        event.stopPropagation();
    }
}

Note.lastID = 0;
Note.dragged = null;
