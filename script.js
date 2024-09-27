var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Elements
var form = document.getElementById('resumeForm');
var resumeOutput = document.getElementById('resumeOutput');
var inputs = document.querySelectorAll('input');
// Real-time validation function
function validateForm() {
    let isValid = true;
    // Clear previous error messages
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(el => el.textContent = '');
    // Validate each input field
    inputs.forEach(input => {
        const value = input.value.trim();
        if (!value) {
            isValid = false;
            const errorElement = document.getElementById(`${input.name}Error`);
            if (errorElement) {
                errorElement.textContent = `${input.name} is required.`;
            }
        }
    });
    return isValid;
}
// Function to handle form submission
form.addEventListener('submit', function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        // Validate the form before generating the resume
        if (!validateForm()) {
            return;
        }
        yield updateResume();
    });
});
// Real-time input event listener
inputs.forEach(input => {
    input.addEventListener('input', () => __awaiter(this, void 0, void 0, function* () {
        yield updateResume();
    }));
});
// Function to read image file and convert to Base64
function readImageFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    });
}
// Function to update and display the resume in real-time
function updateResume() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validateForm()) {
            return;
        }
        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const degree = document.getElementById('degree').value;
        const institute = document.getElementById('institute').value;
        const gradYear = parseInt(document.getElementById('gradYear').value);
        const company = document.getElementById('company').value;
        const role = document.getElementById('role').value;
        const yearsWorked = parseInt(document.getElementById('yearsWorked').value);
        const skills = document.getElementById('skills').value.split(',');
        const imageInput = document.getElementById('profileImage');
        let profileImage = undefined; // Default value is undefined
        if (imageInput.files && imageInput.files[0]) {
            profileImage = yield readImageFile(imageInput.files[0]); // Read the image as Base64
        }
        // Create ResumeData object
        const resumeData = {
            name,
            email,
            profileImage,
            education: {
                degree,
                institute,
                gradYear
            },
            workExperience: {
                company,
                role,
                yearsWorked
            },
            skills
        };
        // Generate and display the resume in real-time
        displaysResume(resumeData);
    });
}
// Function to generate resume and display it on the page
// function generateResume(data: ResumeData) {
function displaysResume(data) {
    resumeOutput.innerHTML = `
    ${data.profileImage ? `<div style="text-align: center; margin-bottom: 20px;">
            <img src="${data.profileImage}" alt="Profile Picture" style="width: 150px; height: 150px; border-radius: 50%;">
        </div>` : ''}    
    <h2>${data.name}</h2>
        <p>Email: ${data.email}</p>

        <h3>Education</h3>
        <p>${data.education.degree}, ${data.education.institute} (${data.education.gradYear})</p>

         <h3>Work Experience</h3>
        <p>${data.workExperience.role} at ${data.workExperience.company} (${data.workExperience.yearsWorked} years)</p>

        <h3>Skills</h3>
        <ul>
            ${data.skills.map(skill => `<li>${skill.trim()}</li>`).join('')}
        </ul>
    `;
}
