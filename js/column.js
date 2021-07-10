class Column {

    constructor(id = null, title = "New") {

        if (id) {
            this.element = $("<div>", { class: "column", draggable: "true", "data-column-id": id }).appendTo($(".columns"));
        } else {
            Column.lastID++;
            this.element = $("<div>", { class: "column", draggable: "true", "data-column-id": Column.lastID }).appendTo($(".columns"));
        }

        $("<div>", { class: "column-header", text: title }).appendTo(this.element);
        $("<div>", { class: "notes" }).appendTo(this.element);
        $("<div>", { class: "column-footer" }).appendTo(this.element);
        $("<div>", { class: "add-note button", text: "+" }).appendTo(this.element.find(".column-footer"));
        $("<div>", { class: "remove-column button", text: "×" }).appendTo(this.element.find(".column-footer"));

        $(this.element).find(".add-note").click(function () {
            const note = new Note();
            $(note.element).appendTo($(this).closest(".column").find(".notes"));
        });

        $(this.element).find(".remove-column").click(function () {
            $(this).closest(".column").remove();
            Application.save();
        });

        $(this.element).find(".column-header").dblclick(function () {
            $(this).attr("contenteditable", true);
            $(this).closest(".column").removeAttr("draggable");
            $(this).focus();
        });

        $(this.element).find(".column-header").blur(function () {
            $(this).removeAttr("contenteditable");
            $(this).closest(".column").attr("draggable", true);
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
        Column.dragged = this.element;

        setTimeout(function () {
            $(Column.dragged).addClass("hide");
        }, 0);
    }

    dragend() {
        Column.dragged = null;

        $(this.element).removeClass("hide");
    }

    dragenter() {
        if (this.element == Column.dragged) {
            return;
        }

        if (Column.dragged) {
            $(this.element).addClass("under-column");
        }
    }

    dragleave() {
        if (this.element == Column.dragged) {
            return;
        }

        if (Column.dragged) {
            $(this.element).removeClass("under-column");
        }
    }

    dragover() {
        if (this.element == Column.dragged) {
            return;
        }

        event.preventDefault();
    }

    drop() {
        if (this.element == Column.dragged) {
            return;
        }

        $(".column").removeClass("under-column");

        if (Column.dragged) {

            if ($(this.element).index() > $(Column.dragged).index()) {
                $(Column.dragged).insertAfter($(this.element));
            } else {
                $(Column.dragged).insertBefore($(this.element));
            }
        }

        if (Note.dragged) {

            if (Note.dragged.closest(".column")[0] != this.element[0]) {
                $(Note.dragged).appendTo($(this.element).find(".notes"));
            }
        }

        Application.save();
    }
}

Column.lastID = 0;
Column.dragged = null;
