let students = [];
let studentCount = 0;
let currentEditId = null;

async function addStudent() {
  const name = document.getElementById("nameInput").value;
  const mobile = document.getElementById("mobileInput").value;
  const address = document.getElementById("addressInput").value;

  if (name && mobile && address) {
    try {
      const response = await axios.post("https://crudcrud.com/api/58d9521167184243a08a47be62b964a9/students", {
        name: name,
        mobile: mobile,
        address: address
      });
      const student = response.data;
      renderStudent(student);
      updateStudentCount();
      clearInputs();
    } catch (error) {
      console.error("Error adding student:", error);
    }
  } else {
    alert("Please fill in all fields!");
  }
}

async function deleteStudent(id) {
  try {
    await axios.delete(`https://crudcrud.com/api/58d9521167184243a08a47be62b964a9/students/${id}`);
    document.getElementById(`student_${id}`).remove();
    updateStudentCount();
  } catch (error) {
    console.error("Error deleting student:", error);
  }
}

async function fetchStudents() {
  try {
    const response = await axios.get("https://crudcrud.com/api/58d9521167184243a08a47be62b964a9/students");
    students = response.data;
    students.forEach(student => renderStudent(student));
    updateStudentCount();
  } catch (error) {
    console.error("Error fetching students:", error);
  }
}

async function renderStudent(student) {
  const studentsList = document.getElementById("studentsList");
  const listItem = document.createElement("li");
  listItem.setAttribute("id", `student_${student._id}`);
  listItem.innerHTML = `
    <span>${student.name} | ${student.mobile} | ${student.address}</span>
    <button onclick="deleteStudent('${student._id}')">Delete</button>
    <button onclick="showEditForm('${student._id}')">Edit</button>
  `;
  studentsList.appendChild(listItem);
}

async function addOrUpdateStudent() {
  const name = document.getElementById("nameInput").value;
  const mobile = document.getElementById("mobileInput").value;
  const address = document.getElementById("addressInput").value;

  if (name && mobile && address) {
    if (currentEditId) {
      try {
        await axios.put(`https://crudcrud.com/api/58d9521167184243a08a47be62b964a9/students/${currentEditId}`, {
          name: name,
          mobile: mobile,
          address: address
        });
        const index = students.findIndex(student => student._id === currentEditId);
        if (index !== -1) {
          students[index].name = name;
          students[index].mobile = mobile;
          students[index].address = address;
          document.getElementById(`student_${currentEditId}`).innerHTML = `
            <span>${name} | ${mobile} | ${address}</span>
            <button onclick="deleteStudent('${currentEditId}')">Delete</button>
            <button onclick="showEditForm('${currentEditId}')">Edit</button>
          `;
          clearInputs();
          currentEditId = null;
          document.getElementById("addButton").innerText = "Add";
        } else {
          console.error("Student not found with ID:", currentEditId);
          alert("Student not found. Please try again.");
        }
      } catch (error) {
        console.error("Error updating student:", error);
      }
    } else {
      addStudent();
    }
  } else {
    alert("Please fill in all fields!");
  }
}

function showEditForm(id) {
  currentEditId = id;
  const student = students.find(student => student._id === id);
  if (student) {
    document.getElementById("nameInput").value = student.name;
    document.getElementById("mobileInput").value = student.mobile;
    document.getElementById("addressInput").value = student.address;
    document.getElementById("addButton").innerText = "Update";
  } else {
    console.error("Student not found with ID:", id);
    alert("Student not found. Please try again.");
  }
}

async function updateStudentCount() {
    const studentCountElement = document.getElementById("studentCount");
    studentCountElement.innerText = students.length;
  }
  
function clearInputs() {
  document.getElementById("nameInput").value = "";
  document.getElementById("mobileInput").value = "";
  document.getElementById("addressInput").value = "";
}

fetchStudents();
