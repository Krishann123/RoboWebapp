import { supabase } from "@/lib/supabase-client";
const table_body = document.getElementById("nomination-table-body");
const table_container = document.querySelector(".table-container");

let page = 0;
const pageSize = 10;
let totalCount = 0;

async function fetchTotalCount() {
    // const { count, error } = await supabase
    //     .from("Person")
    //     .select("*", { count: "exact", head: true });

    // if (error) {
    //     console.error("Error fetching total count:", error.message);
    //     return 0;
    // }
    const { count, error } = await supabase
        .from("persons_data")
        .select("*", { count: "exact", head: true });

    return count;
}

async function fetchNominations() {
    // const { data, error } = await supabase
    //     .from("Person")
    //     .select(
    //         `
    //         firstname,
    //         surname,
    //         contact_number,
    //         Designation:designationID ( role_name )
    //     `
    //     )
    //     .range(page * pageSize, (page + 1) * pageSize - 1);
    const { data, error } = await supabase
        .from("persons_data")
        .select("*")
        .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
        console.error("Error fetching nominations:", error.message);
        return [];
    }

    return data;
}

async function renderTable() {
    const nominations = await fetchNominations();

    table_body.innerHTML = "";

    nominations.forEach((entry, index) => {
        // const { firstname, surname, contact_number, Designation } = entry;
        const {
            ["Full Name"]: fullName,
            ["Contact Number"]: contactNumber,
            ["is Shortlisted"]: isShortlisted,
            social,
            email,
            Role: role,
            Category: category,
            qna_1,
            qna_2,
            qna_3,
            address,
            School: school,
            ["School Link"]: schoolLink,
        } = entry;

        // <td>${firstname || ""}</td>
        // <td>${surname || ""}</td>
        // <td>${Designation?.role_name || ""}</td>
        // <td>${contact_number || ""}</td>
        
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${page * pageSize + index + 1}</td>
            <td>${fullName || ""}</td>
            <td>${contactNumber || ""}</td>
            <td>${isShortlisted || ""}</td>
            <td>${social || ""}</td>
            <td>${email || ""}</td>
            <td>${role || ""}</td>
            <td>${category || ""}</td>
            <td>${qna_1 || ""}</td>
            <td>${qna_2 || ""}</td>
            <td>${qna_3 || ""}</td>
            <td>${address || ""}</td>
            <td>${school || ""}</td>
            <td>${schoolLink || ""}</td>
        `;
        table_body.appendChild(row);
    });

    updateButtons();
}

function updateButtons() {
    previousButton.disabled = page === 0;
    nextButton.disabled = (page + 1) * pageSize >= totalCount;
}

const paginationControls = document.createElement("div");
paginationControls.style.display = "flex";
paginationControls.style.justifyContent = "flex-end";
paginationControls.style.gap = "10px";
paginationControls.style.marginTop = "10px";

const previousButton = document.createElement("button");
previousButton.textContent = "Previous";
previousButton.style.padding = "8px 12px";
previousButton.style.border = "none";
previousButton.style.borderRadius = "5px";
previousButton.style.backgroundColor = "#233876";
previousButton.style.color = "white";
previousButton.style.cursor = "pointer";
previousButton.addEventListener("click", () => {
    if (page > 0) {
        page--;
        renderTable();
    }
});

const nextButton = document.createElement("button");
nextButton.textContent = "Next";
nextButton.style.padding = "8px 12px";
nextButton.style.border = "none";
nextButton.style.borderRadius = "5px";
nextButton.style.backgroundColor = "#233876";
nextButton.style.color = "white";
nextButton.style.cursor = "pointer";
nextButton.addEventListener("click", () => {
    page++;
    renderTable();
});

paginationControls.appendChild(previousButton);
paginationControls.appendChild(nextButton);
table_container.appendChild(paginationControls);

export async function initNominations() {
    totalCount = await fetchTotalCount();
    await renderTable();
}
