<template>
  <div :id="id"></div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import "quill/dist/quill.snow.css"
import { useImageStore } from "@/stores/image"

// import thêm module resize ảnh
import Quill from "quill";
import ImageResize from "quill-image-resize-module-react";
Quill.register("modules/imageResize", ImageResize);

export default {
  props: {
    id: {
      type: String,
      default: "editor"
    },
    modelValue: String,
    placeholder: {
      type: String,
      default: "Nhập nội dung..."
    }
  },
  setup(props, { emit }) {
    const editorContent = ref(props.modelValue);
    let quill = null;
    const store = useImageStore()

    onMounted(async () => {
      const Quill = (await import("quill")).default;

      quill = new Quill(`#${props.id}`, {
        theme: "snow",
        placeholder: props.placeholder,
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ color: [] }, { background: [] }],
              [{ script: "sub" }, { script: "super" }],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ indent: "-1" }, { indent: "+1" }],
              [{ direction: "rtl" }],
              [{ align: [] }],
              ["blockquote", "code-block"],
              ["link", "image", "video"],
              ["clean"],
            ],
            handlers: {
              image: function () {
                const input = document.createElement("input");
                input.setAttribute("type", "file");
                input.setAttribute("accept", "image/*");
                input.click();

                input.onchange = async () => {
                  const file = input.files && input.files[0];
                  if (!file) return;
                
                  if (file) {
                      const formData = new FormData();
                  formData.append('upload', file);
                    // const formData = new FormData();
                    // formData.append("image", file);

                    try {
                      // uploadImage cần trả về url ảnh từ server
                      const response = await store.uploadImage(formData);

                      const imageUrl = response?.url || response;
                      if (imageUrl) {
                        const range = quill.getSelection();
                        quill.insertEmbed(range.index, "image", imageUrl);
                      } else {
                        alert("Upload thất bại");
                      }
                    } catch (e) {
                      console.error("Upload error:", e);
                      alert("Có lỗi xảy ra khi upload");
                    }
                  }
                };
              },
            },
          },
          imageResize: {
            modules: ["Resize", "DisplaySize", "Toolbar"],
          },
        },
      });

      if (props.modelValue) {
        quill.clipboard.dangerouslyPasteHTML(props.modelValue);
      }

      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        editorContent.value = html;
        emit("update:modelValue", html);
      });
    });

    watch(
      () => props.modelValue,
      (newValue) => {
        if (quill && newValue !== quill.root.innerHTML) {
          quill.clipboard.dangerouslyPasteHTML(newValue || "");
        }
      }
    );

    return {
      editorContent,
    };
  },
};
</script>

<style>
#editor {
  min-height: 138px;
}

.ql-editor.ql-blank::before {
  font-size: 16px;
  color: #999;
}
</style>
