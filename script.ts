// Define interface for Resume Data
interface ResumeData {
    name: string;
    email: string;
    profileImage?: string;
    education: {
        degree: string;
        institute: string;
        gradYear: number;
    };
    workExperience: {
        company: string;
        role: string;
        yearsWorked: number;
    };
    skills: string[];
}

// Elements
var form = document.getElementById('resumeForm')!;
var resumeOutput = document.getElementById('resumeOutput')!;
var inputs = document.querySelectorAll('input');

// Real-time validation function
function validateForm(): boolean {
    let isValid = true;

    // Clear previous error messages
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(el => el.textContent = '');

    // Validate each input field
    inputs.forEach(input => {
        const value = (input as HTMLInputElement).value.trim();
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
form.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Validate the form before generating the resume
    if (!validateForm()) {
        return;
    }

    await updateResume();
});

// Real-time input event listener
inputs.forEach(input => {
    input.addEventListener('input', async () => {
        await updateResume();
    });
});
// Function to read image file and convert to Base64
async function readImageFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Function to update and display the resume in real-time
async function updateResume() {
    if (!validateForm()) {
        return;
    }

    // Get form data
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const degree = (document.getElementById('degree') as HTMLInputElement).value;
    const institute = (document.getElementById('institute') as HTMLInputElement).value;
    const gradYear = parseInt((document.getElementById('gradYear') as HTMLInputElement).value);
    const company = (document.getElementById('company') as HTMLInputElement).value;
    const role = (document.getElementById('role') as HTMLInputElement).value;
    const yearsWorked = parseInt((document.getElementById('yearsWorked') as HTMLInputElement).value);
    const skills = (document.getElementById('skills') as HTMLInputElement).value.split(',');

    const imageInput = document.getElementById('profileImage') as HTMLInputElement;
    let profileImage: string | undefined = undefined;  // Default value is undefined
    if (imageInput.files && imageInput.files[0]) {
        profileImage = await readImageFile(imageInput.files[0]);  // Read the image as Base64
    }

    // Create ResumeData object
    const resumeData: ResumeData = {
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
}
// Function to generate resume and display it on the page
// function generateResume(data: ResumeData) {
    function displaysResume(data: ResumeData) {
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