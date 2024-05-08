<script setup lang="ts">
const numberedSteps = [
    {
        title: 'Extraction',
        subtitle: 'Kết quả',
    },
    {
        title: 'Quantitation',
        subtitle: 'Kết quả',
    },
    {
        title: 'Amplification',
        subtitle: 'Kết quả',
    },
];

const currentStep = ref(0);
const isPasswordVisible = ref(false);
const isCPasswordVisible = ref(false);

const formData = ref({
    username: '',
    email: '',
    password: '',
    cPassword: '',
    firstName: '',
    lastName: '',
    country: undefined,
    language: undefined,
    twitter: '',
    facebook: '',
    googlePlus: '',
    LinkedIn: '',

});

const onSubmit = () => {
    console.log(formData.value);
};
</script>

<template>
    <VCard>
        <VCardText>
            <!-- 👉 Stepper -->
            <AppStepper v-model:current-step="currentStep" :items="numberedSteps" class="stepper-icon-step-bg" />
        </VCardText>

        <VDivider />

        <VCardText>
            <!-- 👉 stepper content -->
            <VForm>
                <VWindow v-model="currentStep" class="disable-tab-transition">
                    <VWindowItem>
                        <VRow>
                            <VCol cols="12">
                                <h6 class="text-h6 font-weight-medium">
                                    Extraction
                                </h6>
                                <p class="mb-0">
                                    Kết quả
                                </p>
                            </VCol>

                            <VCol cols="12" md="6">
                                <AppTextField v-model="formData.username" placeholder="CarterLeonardo"
                                    label="Username" />
                            </VCol>

                            <VCol cols="12" md="6">
                                <AppTextField v-model="formData.email" placeholder="carterleonardo@gmail.com"
                                    label="Email" />
                            </VCol>

                            <VCol cols="12" md="6">
                                <AppTextField v-model="formData.password" label="Password" placeholder="············"
                                    :type="isPasswordVisible ? 'text' : 'password'"
                                    :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                                    @click:append-inner="isPasswordVisible = !isPasswordVisible" />
                            </VCol>

                            <VCol cols="12" md="6">
                                <AppTextField v-model="formData.cPassword" label="Confirm Password"
                                    placeholder="············" :type="isCPasswordVisible ? 'text' : 'password'"
                                    :append-inner-icon="isCPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                                    @click:append-inner="isCPasswordVisible = !isCPasswordVisible" />
                            </VCol>
                        </VRow>
                    </VWindowItem>

                    <VWindowItem>
                        <VRow>
                            <VCol cols="12">
                                <h6 class="text-h6 font-weight-medium">
                                    Quantitation
                                </h6>
                                <p class="mb-0">
                                    Kết quả
                                </p>
                            </VCol>

                            <VCol cols="12" md="6">
                                <AppTextField v-model="formData.firstName" label="First Name" placeholder="Leonard" />
                            </VCol>

                            <VCol cols="12" md="6">
                                <AppTextField v-model="formData.lastName" label="Last Name" placeholder="Carter" />
                            </VCol>

                            <VCol cols="12" md="6">
                                <AppSelect v-model="formData.country" label="Country" placeholder="Select Country"
                                    :items="['UK', 'USA', 'Canada', 'Australia', 'Germany']" />
                            </VCol>

                            <VCol cols="12" md="6">
                                <AppSelect v-model="formData.language" label="Language" placeholder="Select Language"
                                    :items="['English', 'Spanish', 'French', 'Russian', 'German']" />
                            </VCol>
                        </VRow>
                    </VWindowItem>

                    <VWindowItem>
                        <VRow>
                            <VCol cols="12">
                                <h6 class="text-h6 font-weight-medium">
                                    Amplification
                                </h6>
                                <p class="mb-0">
                                    Kết quả
                                </p>
                            </VCol>

                            <VCol cols="12" md="6">
                                <AppTextField v-model="formData.twitter" placeholder="https://twitter.com/abc"
                                    label="Twitter" />
                            </VCol>

                            <VCol cols="12" md="6">
                                <AppTextField v-model="formData.facebook" placeholder="https://facebook.com/abc"
                                    label="Facebook" />
                            </VCol>

                            <VCol cols="12" md="6">
                                <AppTextField v-model="formData.googlePlus" placeholder="https://plus.google.com/abc"
                                    label="Google+" />
                            </VCol>

                            <VCol cols="12" md="6">
                                <AppTextField v-model="formData.LinkedIn" placeholder="https://linkedin.com/abc"
                                    label="LinkedIn" />
                            </VCol>
                        </VRow>
                    </VWindowItem>
                </VWindow>

                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                    <VBtn color="secondary" variant="tonal" :disabled="currentStep === 0" @click="currentStep--">
                        <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                        Previous
                    </VBtn>

                    <VBtn v-if="numberedSteps.length - 1 === currentStep" color="success" @click="onSubmit">
                        submit
                    </VBtn>

                    <VBtn v-else @click="currentStep++">
                        Next

                        <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                    </VBtn>
                </div>
            </VForm>
        </VCardText>
    </VCard>
</template>
