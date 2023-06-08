import React from 'react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';

const Ckeditor = ({ description, setDescription }) => {
   return (
      <div>
         <CKEditor
            editor={ClassicEditor}
            data={description}
            onChange={(event, editor) => setDescription(editor.getData())}
         />
      </div>
   );
};

export default Ckeditor;