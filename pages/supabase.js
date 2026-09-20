const { createClient } = window.supabase;

const supabaseUrl = "https://lbonxqgfhcqyxsrnnkpl.supabase.co";

const supabaseKey = "sb_publishable_eCFhEEDQsh3lco5S5NhTcQ_uh_yehfI";

const supabase = createClient(supabaseUrl, supabaseKey);

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 1. Get form values
  const email = document.getElementById("email").value.trim();

  const password = document.getElementById("password").value;

  // 2. Login
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,

    password: password,
  });

  // 3. Check errors
  if (error) {
    alert(error.message);

    return;
  }

  // 4. Login successful
  alert("Login successful!");
  navigateTo("home");
});

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();

  const email = document.getElementById("email").value.trim();

  const password = document.getElementById("password").value;

  const confirmPassword = document.getElementById("confirmPassword").value;

  // 1. Check passwords
  if (password !== confirmPassword) {
    alert("Passwords do not match!");

    return;
  }

  // 2. Create Supabase account
  const { data, error } = await supabase.auth.signUp({
    email: email,

    password: password,

    options: {
      data: {
        full_name: name,
      },
    },
  });

  // 3. Check for errors
  if (error) {
    alert(error.message);

    return;
  }

  // 4. Success
  alert("Account created! Check your email if confirmation is required.");

  window.location.href = "./login.html";
});




const recipeForm = document.getElementById("recipeForm");

recipeForm.addEventListener("submit", async (e) => {

  e.preventDefault();


  // 1. Get logged-in user
  const {
    data: { user }
  } = await supabase.auth.getUser();


  // 2. Protect recipe creation
  if (!user) {

    alert("Please login first!");

    return;
  }


  // 3. Get recipe data
  const title = document.getElementById("title").value.trim();

  const description =
    document.getElementById("description").value.trim();


  // 4. Insert into Supabase
  const { data, error } = await supabase

    .from("recipes")

    .insert({

      title: title,

      description: description,

      user_id: user.id,

      category: document.getElementById("category").value,

    })

    .select()
    .single();


  // 5. Handle errors
  if (error) {

    alert(error.message);

    return;
  }


  alert("Recipe published successfully!");

  console.log(data);

});

const imageFile = document.getElementById("recipeImage").files[0];
const fileName = `${crypto.randomUUID()}.jpg`;
const filePath = `${user.id}/${fileName}`;

const { data, error } = await supabase.storage

  .from("recipe-images")

  .upload(filePath, imageFile, {

    cacheControl: "3600",

    upsert: false

  });


  const { data: publicUrlData } =
  supabase.storage

    .from("recipe-images")

    .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;





recipeForm.addEventListener("submit", async (e) => {

  e.preventDefault();


  // 1. Get logged-in user
  const {
    data: { user }
  } = await supabase.auth.getUser();


  if (!user) {

    alert("Please login first!");

    return;
  }


  // 2. Get form values
  const title = document.getElementById("title").value.trim();

  const description =
    document.getElementById("description").value.trim();

    const category = document.getElementById("category").value;

  const imageFile =
    document.getElementById("recipeImage").files[0];


  if (!imageFile) {

    alert("Please select a recipe image!");

    return;
  }


  // 3. Create unique file path
  const extension =
    imageFile.name.split(".").pop().toLowerCase();

  const fileName =
    `${crypto.randomUUID()}.${extension}`;

  const filePath = `${user.id}/${fileName}`;


  // 4. Upload image
  const { error: uploadError } = await supabase.storage

    .from("recipe-images")

    .upload(filePath, imageFile, {

      cacheControl: "3600",

      upsert: false,

      contentType: imageFile.type

    });


  if (uploadError) {

    alert(uploadError.message);

    return;
  }


  // 5. Get public image URL
  const { data: publicUrlData } =
    supabase.storage

      .from("recipe-images")

      .getPublicUrl(filePath);


  const imageUrl = publicUrlData.publicUrl;


  // 6. Save recipe in database
  const { data, error } = await supabase

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

    alert(error.message);

    return;
  }


  alert("Recipe and image saved successfully!");

  console.log(data);

});