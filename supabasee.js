const { createClient } = window.supabase;

const supabaseUrl = "https://lbonxqgfhcqyxsrnnkpl.supabase.co";

const supabaseKey = "sb_publishable_eCFhEEDQsh3lco5S5NhTcQ_uh_yehfI";

const supabase = createClient(supabaseUrl, supabaseKey);

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        // Get email and password
        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;


        const { data, error } =
            await supabase.auth.signInWithPassword({

                email: email,
                password: password

            });

        if (error) {

            alert(error.message);

            return;
        }


        alert("Login successful!");
        window.location.href = "./index.html";

    });

}


const signupForm =
    document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        if (password !== confirmPassword) {

            alert("Passwords do not match!");

            return;
        }

        const { data, error } =
            await supabase.auth.signUp({

                email: email,
                password: password,
                options: {
                    data: {
                        full_name: name
                    }
                }

            });

        if (error) {
            alert(error.message);
            return;
        }

        alert(
            "Account created successfully! Check your email if confirmation is required."
        );

        naviateTo(loginForm);

    });

}


// ==========================================
// 4. RECIPE FORM
// ==========================================

const recipeForm =
    document.getElementById("recipeForm");


if (recipeForm) {

    recipeForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const {
            data: { user },
            error: userError
        } = await supabase.auth.getUser();

        if (userError) {
            alert(userError.message);
            return;
        }

        if (!user) {
            alert("Please login first!");
            return;
        }


        const title =
            document.getElementById("title").value.trim();

        const description =
            document
                .getElementById("description")
                .value
                .trim();

        const category =
            document.getElementById("category").value;

        const imageFile =
            document
                .getElementById("recipeImage")
                .files[0];


        if (!imageFile) {
            alert("Please select a recipe image!");
            return;
        }


        const extension =
            imageFile.name
                .split(".")
                .pop()
                .toLowerCase();


        const fileName =
            `${crypto.randomUUID()}.${extension}`;

        const filePath =
            `${user.id}/${fileName}`;

        const { error: uploadError } =
            await supabase.storage
                .from("recipe-images")
                .upload(
                    filePath,
                    imageFile,
                    {
                        cacheControl: "3600",
                        upsert: false,
                        contentType: imageFile.type

                    }
                );

        if (uploadError) {
            alert(
                "Image upload failed: " +
                uploadError.message
            );
            return;
        }

        const {
            data: publicUrlData
        } = supabase.storage
            .from("recipe-images")
            .getPublicUrl(filePath);

        const imageUrl =
            publicUrlData.publicUrl;


        const {
            data,
            error
        } = await supabase
            .from("recipes")
            .insert({

                title: title,

                category: category,

                description: description,

                image_url: imageUrl,

                user_id: user.id

            })

            .select()

            .single();

        if (error) {
            alert(
                "Recipe save failed: " +
                error.message
            );
            return;
        }


        alert(
            "Recipe and image saved successfully!"
        );

        console.log("Saved recipe:", data);

        recipeForm.reset();

    });

}