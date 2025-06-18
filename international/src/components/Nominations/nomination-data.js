import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase-client";

document.addEventListener("DOMContentLoaded", () => {
    const nominationForm = document.getElementById("nomination-form");

    if (!(nominationForm instanceof HTMLFormElement)) {
        console.error("Form not found or not a valid HTMLFormElement.");
        return;
    }

    nominationForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(nominationForm);

        const personID = uuidv4();
        const addressID = uuidv4();
        const schoolID = uuidv4();
        const qnaID = uuidv4();
        const categoryID = uuidv4();
        const designationID = uuidv4();

        // Collect social media selections
        const socialMedia = [];
        nominationForm
            .querySelectorAll('input[name="socialMedia"]:checked')
            .forEach((checkbox) => {
                socialMedia.push(checkbox.value);
            });

        // Collect "Other" social media input
        const socialMediaOther = formData.get("socialMediaOther");
        if (socialMediaOther && socialMediaOther.trim() !== "") {
            socialMedia.push(socialMediaOther.trim());
        }

        const personalInfo = {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            email: formData.get("email"),
            contact: formData.get("contact"),
            shortlisted: formData.get("shortlisted"),
            social: socialMedia.length > 0 ? socialMedia.join(", ") : "",
        };

        const address = {
            addressID,
            address: formData.get("address"),
            region: formData.get("region"),
            country: formData.get("country"),
        };

        const school = {
            schoolID,
            school_name: formData.get("schoolName"),
            school_weblink: formData.get("schoolWebsite"),
        };

        const qna = {
            qnaID,
            qna_1: formData.get("description"),
            qna_2: formData.get("awardMeaning"),
            qna_3: formData.get("achievements"),
        };

        const category = {
            categoryID,
            category_name: formData.get("awardCategory"),
        };

        const designation = {
            designationID,
            role_name: formData.get("designation"),
        };

        try {
            console.log("Starting nomination transaction...");

            //check if the person name already exists
            const { data: personData, error: checkPersonError } = await supabase
                .from("Person")
                .select("*")
                .eq("firstname", personalInfo.firstName)
                .eq("surname", personalInfo.lastName)
                .single();
            if (checkPersonError && checkPersonError.code !== "PGRST116") {
                throw new Error(
                    `Error checking existing person: ${checkPersonError.message}`
                );
            }
            if (personData) {
                alert(
                    "This person has already been nominated. Please check the details."
                );
                return;
            }
            console.log("No existing person found, proceeding with insert.");

            // Insert Address
            const { error: addressError } = await supabase
                .from("Address")
                .insert([address]);
            if (addressError)
                throw new Error(
                    `Address insert failed: ${addressError.message}`
                );
            console.log("Address inserted");

            // Insert School
            const { error: schoolError } = await supabase
                .from("School")
                .insert([school]);
            if (schoolError)
                throw new Error(`School insert failed: ${schoolError.message}`);
            console.log("School inserted");

            // Insert QNA
            const { error: qnaError } = await supabase
                .from("QNA")
                .insert([qna]);
            if (qnaError)
                throw new Error(`QNA insert failed: ${qnaError.message}`);
            console.log("QNA inserted");

            // Insert Category
            const { error: categoryError } = await supabase
                .from("Category")
                .insert([category]);
            if (categoryError)
                throw new Error(
                    `Category insert failed: ${categoryError.message}`
                );
            console.log("Category inserted");

            // Insert Designation
            const { error: designationError } = await supabase
                .from("Designation")
                .insert([designation]);
            if (designationError)
                throw new Error(
                    `Designation insert failed: ${designationError.message}`
                );
            console.log("Designation inserted");

            // Insert Person
            const { error: personError } = await supabase
                .from("Person")
                .insert([
                    {
                        id: personID,
                        firstname: personalInfo.firstName,
                        surname: personalInfo.lastName,
                        contact_number: personalInfo.contact,
                        email: personalInfo.email,
                        if_shortlisted: personalInfo.shortlisted,
                        social: personalInfo.social,
                        addressID: addressID,
                        schoolID: schoolID,
                        qnaID: qnaID,
                        categoryID: categoryID,
                        designationID: designationID,
                    },
                ]);
            if (personError)
                throw new Error(`Person insert failed: ${personError.message}`);
            console.log("Person inserted");

            alert("Nomination submitted successfully!");
            nominationForm.reset();
        } catch (error) {
            console.error("Transaction error:", error.message);

            alert(`Failed to submit nomination: ${error.message}`);
        }
    });
});
