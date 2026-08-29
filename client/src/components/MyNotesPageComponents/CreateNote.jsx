import CreateNoteForm from "../Forms/CreateNoteForm";
import CreateNoteSideImg from "../SideImages/CreateNoteSideImg";
function CreateNote() {
  return (
    <div className="min-h-[70vh] xl:mt-0 flex flex-col md:flex-row px-8 gap-10 justify-center md:justify-around items-center">
      <div className="order-2 xl:order-1 hidden xl:block">
        <CreateNoteSideImg />
      </div>

      <div className="xl:mt-0 order-1 xl:order-2 w-[500px] max-w-[90vw] self-center">
        <CreateNoteForm />
      </div>
    </div>
  );
}

export default CreateNote;
